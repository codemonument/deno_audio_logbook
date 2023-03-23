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
   * From Telegram Message, important: in seconds!
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
  userId: z.coerce.number(),

  /**
   * The unix auth date timestamp
   */
  unixAuthDate: z.coerce.number(),

  /**
   * The Telegram Username
   */
  username: z.string(),

  /**
   * Some user information for pretty display
   * - allows nullable(), bc URL.searchParams.get() returns 'null' when they're not available
   */
  firstName: z.string().optional().nullable().transform((val) =>
    val ?? undefined
  ),
  lastName: z.string().optional().nullable().transform((val) =>
    val ?? undefined
  ),
  photoUrl: z.string().optional().nullable().transform((val) =>
    val ?? undefined
  ),
});

export type UserSession = z.infer<typeof UserSession>;

export type DbSchema = {
  audiobook_recordings: AudioRecording;
  audiobook_sessions: UserSession;
};
