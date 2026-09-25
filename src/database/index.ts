import { Account } from './entities/account.entity.js';
import { Email } from './entities/email.entity.js';
import { EmailAddress } from './entities/email-address.entity.js';
import { EmailReceiver } from './entities/email-receiver.entity.js';
import { EmailTag } from './entities/email-tag.entity.js';
import { Tag } from './entities/tag.entity.js';
import { BaseTables1720373216667 } from './migrations/1720373216667-base-tables.js';
import { AddImapMessageIdToEmail1775173532152 } from './migrations/1775173532152-add-imap-message-id.js';

export const DATABASE_OPTIONS = {
  entities: [Account, Email, EmailAddress, EmailReceiver, EmailTag, Tag],
  migrations: [BaseTables1720373216667, AddImapMessageIdToEmail1775173532152],
};
