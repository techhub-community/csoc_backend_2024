import { Generated } from 'kysely';

interface UserTable {
  id: Generated<number>;
  name: string;
  mobile: string;
  program: string;
  password: string;
  email: string;
  about?: string;
  props?: string;
  verified: boolean;
}

interface MessageTable {
  id: Generated<number>;
  name: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface TeamTable {
  team_id: Generated<number>;
  team_type: string;
  leader_id: number;
  member1_id?: number;
  member2_id?: number;
  filled?: boolean;
}

interface RequestTable {
  request_id: Generated<number>;
  receiver_id: number;
  sender_id: number;
}

export interface Database {
  messages: MessageTable;
  requests: RequestTable;
  teams: TeamTable;
  users: UserTable;
}
