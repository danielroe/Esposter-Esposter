import { CompositeKeyEntity } from "@/models/azure";
import { messageSchema } from "@/models/esbabbler/message";
import { MessageMetadataEntity, messageMetadataSchema } from "@/models/esbabbler/message/metadata";
import { z } from "zod";

export class MessageReplyMetadataEntity extends MessageMetadataEntity {
  messageReplyRowKey!: string;

  constructor(init: Partial<MessageReplyMetadataEntity> & CompositeKeyEntity) {
    super();
    Object.assign(this, init);
  }
}

export const messageReplyMetadataSchema = messageMetadataSchema.merge(
  z.object({ messageReplyRowKey: messageSchema.shape.rowKey }),
) satisfies z.ZodType<MessageReplyMetadataEntity>;
