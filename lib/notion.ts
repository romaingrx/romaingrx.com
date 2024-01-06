'use server';
import { MessageType } from '@/models/notion';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function sendMessage({
  title,
  type,
  email,
  message,
}: {
  title?: string;
  type: MessageType;
  email: string;
  message: string;
}) {
  if (!title) {
    title = `${type} from ${email}`;
  }

  const page = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: process.env.NOTION_MESSAGE_DATABASE_ID!,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      Type: {
        select: {
          name: type,
        },
      },
      Message: {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
      Email: {
        email: email,
      },
      'Created time': {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });
  return page;
}
