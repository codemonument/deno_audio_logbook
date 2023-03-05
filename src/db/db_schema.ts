export type AudioRecordingsTable = {
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

export type UserTable = {
  // is number good? => forgeability
  userId: number;
};

export type DbSchema = {
  audiobook_recordings: AudioRecordingsTable;
  audiobook_users: UserTable;
};
