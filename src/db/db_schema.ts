import { z } from "zod";

export type AudioRecording = {
  /**
   * Telegram Voice/Audio File ID
   */
  audioId: string;

  /**
   * User ID is Telegram Usernumber
   */
  userId: number;

  /**
   * The Path of the file on the storage
   * @example "userId/unixTimestamp.ogg"
   * Eventually without extension if not ogg or not from message:voice callback
   */
  filePath: string;

  /**
   * The MimeType of the Telegram File
   * @example "audio/ogg"
   */
  mimeType: string;

  /**
   * From Telegram Message
   */
  unixTimestamp: number;
};

export const UserSession = z.object({
  /**
   * The hash of this one loggin request 
   * Will be the primary key for this table 
   */
  hash: z.string(),

  /**
   * Telegram User Id
   */
  userId: z.number(),

  /**
   * The unix auth date timestamp
   */
  unixAuthDate: z.number(),

  /**
   * Some user information for pretty display
   */
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type UserSession = z.infer<typeof UserSession>;

export type DbSchema = {
  audiobook_recordings: AudioRecording;
  audiobook_sessions: UserSession;
};
