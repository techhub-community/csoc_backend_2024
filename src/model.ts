import { D1Orm, DataTypes, Model } from "d1-orm";

export const users = new Model(
  {
    tableName: "users",
    primaryKeys: "id",
    autoIncrement: "id",
    uniqueKeys: [["email"]],
  },
  {
    id: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
    name: {
      type: DataTypes.TEXT,
      notNull: true,
      defaultValue: "anonymous",
    },
    usn: {
      type: DataTypes.TEXT,
      notNull: true,
    },
    role: {
      type: DataTypes.TEXT,
      notNull: true,
      defaultValue: "mentee",
    },
    password: {
      type: DataTypes.TEXT,
      notNull: true,
    },
    email: {
      type: DataTypes.TEXT,
    },
    about: {
      type: DataTypes.TEXT,
      notNull: false,
      defaultValue: ""
    },
    props: {
      type: DataTypes.TEXT,
      notNull: false,
      defaultValue: "{}"
    },
    verified: {
      type: DataTypes.BOOLEAN,
      notNull: true,
      defaultValue: 0,
    }
  }
);

export const messages = new Model(
  {
    tableName: "messages",
    autoIncrement: "id",
    primaryKeys: "id",
  },
  {
    id: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
    name: {
      type: DataTypes.TEXT,
      defaultValue: "anonymous",
      notNull: true,
    },
    email: {
      type: DataTypes.TEXT,
    },
    subject: {
      type: DataTypes.TEXT,
      notNull: false
    },
    message: {
      type: DataTypes.TEXT,
      notNull: false
    }
  }
);

export function init(db: D1Database) {
  const orm = new D1Orm(db);
  messages.SetOrm(orm);
  users.SetOrm(orm);
}
