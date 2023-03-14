import { AzureContainer } from "@/models/azure/blob";
import { TableEditor, tableEditorSchema } from "@/models/tableEditor/TableEditor";
import { router } from "@/server/trpc";
import { authedProcedure } from "@/server/trpc/procedure";
import { getContainerClient, uploadBlockBlob } from "@/services/azure/blob";
import { SAVE_FILENAME } from "@/services/clicker/constants";
import { jsonDateParser } from "@/utils/json";
import { streamToText } from "@/utils/text";

export const tableEditorRouter = router({
  readTableEditor: authedProcedure.query<TableEditor>(async ({ ctx }) => {
    try {
      const containerClient = await getContainerClient(AzureContainer.TableEditorAssets);
      const blobName = `${ctx.session.user.id}/${SAVE_FILENAME}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const response = await blockBlobClient.download();
      if (!response.readableStreamBody) return new TableEditor();
      return JSON.parse(await streamToText(response.readableStreamBody), jsonDateParser);
    } catch {
      return new TableEditor();
    }
  }),
  saveTableEditor: authedProcedure.input(tableEditorSchema).mutation(async ({ input, ctx }) => {
    try {
      const client = await getContainerClient(AzureContainer.TableEditorAssets);
      const blobName = `${ctx.session.user.id}/${SAVE_FILENAME}`;
      await uploadBlockBlob(client, blobName, JSON.stringify(input));
      return true;
    } catch {
      return false;
    }
  }),
});