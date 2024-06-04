import juice from "juice";
import { Hono } from 'hono';
import * as jose from 'jose';
import bcrypt from 'bcrypt-edge';
import { init, messages, users } from './model';
import { accVerifyHtml, accVerifyText, forgotHtml, forgotText, inviteHtml, inviteText } from './templates';
import { cors } from "hono/cors";

const JWT_SECRET = new TextEncoder().encode('ultra-pro-secret@09874029');
const app = new Hono<{ Bindings: { CSOC_DB: D1Database, SENDINBLUE: string } }>();
const backDomain = 'https://csoc-api.040203.xyz';
const frontDomain = 'https://csoc.040203.xyz';
let apiKey = "";

app.use("*", async (c, next) => {
  apiKey = c.env.SENDINBLUE;
  init(c.env.CSOC_DB);
  await next();
});

app.use('*', cors({
  maxAge: 86400,
  origin: '*',  // Allow all origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  allowHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
}));

// Store Message API
app.post('/send-message', async (c) => {
  const { name, email, subject, message } = await c.req.json();
  const normalizedEmail = email.toLowerCase();

  // Validation for name
  if (name.length < 2 || name.length > 32)
    return c.json({ message: 'Name must be between 2 and 32 characters long!' }, 400);

  // Validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return c.json({ message: 'Invalid email format!' }, 400);

  // Validation for subject
  if (subject.length < 2 || subject.length > 64)
    return c.json({ message: 'Subject must be between 1 and 64 characters long!' }, 400);

  // Validation for message
  if (message.length < 1 || message.length > 2048)
    return c.json({ message: 'Message must be between 1 and 2048 characters long!' }, 400);

  await messages.InsertOne({
    email: normalizedEmail,
    subject,
    message,
    name
  });

  return c.json({ message: 'Message sent successfully!' }, 200);
});

// Registration API
app.post('/register', async (c) => {
  const { name, password, email, usn, role } = await c.req.json();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const normalizedEmail = email.toLowerCase();
  const normalizedRole = role.toLowerCase();
  const normalizedUSN = usn.toUpperCase();

  // Validation for name
  if (name.length < 2 || name.length > 32)
    return c.json({ message: 'Name must be between 2 and 32 characters long!' }, 400);

  // Validation for password
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password))
    return c.json({ message: 'Password must be at least 8 characters long and contain both letters and numbers!' }, 400);

  // Validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return c.json({ message: 'Invalid email format!' }, 400);

  // Validation for role
  if (!['mentor', 'mentee'].includes(normalizedRole))
    return c.json({ message: 'Invalid role attribute!' }, 400);

  // Validation for USN format
  const usnRegex = /^1MV\d{2}[A-Za-z]{2}\d{3}$/;
  if (!usnRegex.test(normalizedUSN))
    return c.json({ message: 'Invalid USN format! It should be in the format 1MV{2 digits}{2 letters}{3 digits}' }, 400);

  // Save user to database
  await users.InsertOne({
    password: hashedPassword,
    name,
    email: normalizedEmail,
    role: normalizedRole,
    usn: normalizedUSN
  });

  // Generate JWT token
  const token = await signPayload({ email: normalizedEmail, pkk: Math.random() * 1000000 });

  await sendMail(name, normalizedEmail, 'Codeshack: Account Verification',
    accVerifyHtml.replace('{{_link_}}', `${backDomain}/verify-account?token=${token}`),
    accVerifyText.replace('{{_link_}}', `${backDomain}/verify-account?token=${token}`));

  return c.json({ message: 'Registration successful. Please check your email to verify your account.' });
});

// Verify Account API
app.get('/verify-account', async (c) => {
  const { token } = c.req.query();

  try {
    const { email } = (await jose.jwtVerify(token, JWT_SECRET)).payload as { email: string };

    // Update user's verified status
    await users.Update({
      where: { email },
      data: { verified: 1 },
    });

    return c.redirect(`${frontDomain}/auth`);
  } catch (e) {
    return c.json({ error: 'Invalid or expired token.' }, 400);
  }
});

// Login API
app.post('/login', async (c) => {
  const { email, password, role } = await c.req.json();

  // Validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return c.json({ error: 'Invalid email format' }, 400);

  // Validation for password
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password))
    return c.json({ error: 'Invalid password format' }, 400);

  // Validation for role
  if (!['mentor', 'mentee'].includes(role.toLowerCase()))
    return c.json({ error: 'Invalid role attribute' }, 400);

  const user = await users.First({ where: { email, role } });

  if (!user || !(bcrypt.compareSync(password, user.password)))
    return c.json({ error: 'Wrong email or password' }, 401);

  const token = await signPayload({ email }, "7d");
  return c.json({ token, name: user.name, role: user.role, about: user.about, email, props: JSON.parse(user.props ?? "{}"), verified: user.verified });
});

// Session API
app.post('/session', async (c) => {
  const { token } = await c.req.json();

  try {
    const email = (await jose.jwtVerify(token, JWT_SECRET)).payload.email as string;
    const user = await users.First({ where: { email } });
    if (!user) return c.json({ valid: false }, 401);

    return c.json({ valid: true, name: user.name, role: user.role, about: user.about, email, props: JSON.parse(user.props ?? "{}"), verified: user.verified });
  } catch (e) {
    return c.json({ valid: false }, 401);
  }
});

// Forgot Password API
app.post('/forgot-password', async (c) => {
  const { email } = await c.req.json();
  const user = await users.First({ where: { email } });
  if (!user) return c.json({ error: 'Email not found' }, 404);
  const resetToken = await signPayload({ email, slt: Math.random() * 1000000 }, "30m");

  // Send reset email
  let resp = await sendMail(user.name, email, 'Codeshack: Password Reset',
    forgotHtml.replace('{{_link_}}', `${frontDomain}/reset-password?token=${resetToken}`),
    forgotText.replace('{{_link_}}', `${frontDomain}/reset-password?token=${resetToken}`));

  console.log("Reset Response: ", resp);
  return c.json({ message: 'Password reset instructions sent to you inbox' });
});

// Reset Password API
app.post('/reset-password', async (c) => {
  const { token, newPassword } = await c.req.json();

  // Validation for password
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(newPassword))
    return c.json({ message: 'Password must be at least 8 characters long and contain both letters and numbers!' }, 400);

  try {
    const { email } = (await jose.jwtVerify(token, JWT_SECRET)).payload as { email: string };
    const user = await users.First({ where: { email } });
    if (!user) return c.json({ error: 'Invalid token' }, 401);
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await users.Update({
      where: { email },
      data: { password: hashedPassword }
    });

    return c.json({ message: "Password reset successful" });
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Update Name API
app.post('/update-name', async (c) => {
  const { token, name } = await c.req.json();

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    const { email } = payload as { email: string };

    // Update user's name
    await users.Update({
      where: { email },
      data: { name },
    });

    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Update About API
app.post('/update-about', async (c) => {
  const { token, about } = await c.req.json();

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    const { email } = payload as { email: string };

    // Update user's about information
    await users.Update({
      where: { email },
      data: { about },
    });

    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Update Password API
app.post('/update-password', async (c) => {
  const { token, oldPass, newPass } = await c.req.json();

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    const { email } = payload as { email: string };

    // Find user by email
    const user = await users.First({ where: { email } });

    if (!user || !(bcrypt.compareSync(oldPass, user.password))) {
      return c.json({ error: 'Invalid old password' }, 401);
    }

    // Update user's password
    const hashedNewPassword = bcrypt.hashSync(newPass, 10);
    await users.Update({ where: { email }, data: { password: hashedNewPassword } });

    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Helper function to verify token and get email
const verifyTokenAndGetEmail = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return (payload as { email: string }).email;
  } catch {
    throw new Error('Invalid token');
  }
};

// Send Invite API (for mentee only)
app.post('/send-invite', async (c) => {
  const { token, reqEmail } = await c.req.json();
  
  try {
    const email = await verifyTokenAndGetEmail(token);

    if (email === reqEmail) return c.json({ error: 'Cannot invite yourself' }, 400);

    const sender = await users.First({ where: { email, role: "mentee" } });
    if (!sender) return c.json({ error: 'Sender not found' }, 404);
    const senderName = sender.name;

    const recipient = await users.First({ where: { email: reqEmail, role: "mentee" } });
    if (!recipient) return c.json({ error: 'Recipient not found' }, 404);
    const rcpEmail = recipient.email ?? "";
    const rcpName = recipient.name;

    const rcpProps = JSON.parse(recipient.props ?? '{}');
    if (rcpProps.teamReq || (rcpProps.team?.a && rcpProps.team?.b))
      return c.json({ error: `${rcpEmail} is not accepting invitations anymore` }, 400);

    rcpProps.teamReq = {
      name: senderName,
      email
    };

    await users.Update({
      where: { email: reqEmail },
      data: { props: JSON.stringify(rcpProps) }
    });

    const senderProps = JSON.parse(sender.props ?? '{}');
    senderProps.team = senderProps.team || {};
    
    if (!senderProps.team.a) {
      senderProps.team.a = {
        email: rcpEmail,
        status: 0
      };
    } else if (!senderProps.team.b) {
      senderProps.team.b = {
        email: rcpEmail,
        status: 0
      };
    } else {
      return c.json({ error: 'You already have two team members' }, 400);
    }

    await users.Update({
      where: { email },
      data: { props: JSON.stringify(senderProps) }
    });

    await sendMail(rcpName, rcpEmail, 'Codeshack: Join a CSOC Team!',
      inviteHtml.replace('{{_user_}}', senderName),
      inviteText.replace('{{_user_}}', senderName));
    
    return c.json({ message: `Invite sent to: ${rcpEmail}` });
  } catch (e) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

// Process Invite API (for mentee only)
app.post('/process-invite', async (c) => {
  const { token, accepted } = await c.req.json();

  try {
    const recipientEmail = await verifyTokenAndGetEmail(token);

    const recipient = await users.First({ where: { email: recipientEmail, role: "mentee" } });
    if (!recipient) return c.json({ error: 'Recipient not found' }, 404);

    const recipientProps = JSON.parse(recipient.props ?? '{}');
    if (!recipientProps.teamReq) return c.json({ error: 'No invitation to process' }, 400);

    const inviterEmail = recipientProps.teamReq.email;
    const inviter = await users.First({ where: { email: inviterEmail, role: "mentee" } });
    if (!inviter) return c.json({ error: 'Inviter not found' }, 404);

    const inviterProps = JSON.parse(inviter.props ?? '{}');
    
    if (accepted) {
      // Update recipient's team
      recipientProps.team = recipientProps.team || {};
      if (!recipientProps.team.a) {
        recipientProps.team.a = {
          email: inviterEmail,
          status: 1
        };
      } else if (!recipientProps.team.b) {
        recipientProps.team.b = {
          email: inviterEmail,
          status: 1
        };
      }

      // Update inviter's team
      if (inviterProps.team.a && inviterProps.team.a.email === recipientEmail) {
        inviterProps.team.a.status = 1;
      } else if (inviterProps.team.b && inviterProps.team.b.email === recipientEmail) {
        inviterProps.team.b.status = 1;
      }
    } else {
      // Remove pending invite from inviter's team
      if (inviterProps.team.a && inviterProps.team.a.email === recipientEmail) {
        delete inviterProps.team.a;
      } else if (inviterProps.team.b && inviterProps.team.b.email === recipientEmail) {
        delete inviterProps.team.b;
      }
    }

    // Remove the team request from recipient's props
    delete recipientProps.teamReq;

    // Update both users in the database
    await users.Update({
      where: { email: recipientEmail },
      data: { props: JSON.stringify(recipientProps) }
    });
    await users.Update({
      where: { email: inviterEmail },
      data: { props: JSON.stringify(inviterProps) }
    });

    return c.json({ message: accepted ? 'Invite accepted' : 'Invite declined' });
  } catch (e) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

app.onError((err, c) => {
  return c.json({ error: "Check your input then try again" }, 400);
});

export default app;

async function sendMail(name: string, to: string, subject: string, bodyHTML: string, bodyText: string) {
  const data = {
    sender: {
      name: "TechHub Team",
      email: "techhub@040203.xyz"
    },
    to: [
      {
        email: to,
        name
      }
    ],
    subject,
    textContent: bodyText,
    htmlContent: juice(bodyHTML),
  };
  
  const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey
    }
  });

  console.log(await resp.text());
  return resp.status < 400;
}

async function signPayload(payload: any, expireIn: string = "1h") {
  return await new jose.SignJWT(payload)
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime(expireIn)
  .sign(JWT_SECRET);
}
