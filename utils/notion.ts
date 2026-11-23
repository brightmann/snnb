import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_KEY as string })
const DATABASE_ID = process.env.NOTION_DATABASE_ID as string

export const fetchPages = async ({ slug, tag }: { slug?: string, tag?: string }) => {
  const and: any = [
    {
      property: 'slug',
      rich_text: {
        is_not_empty: true
      }
    },
    {
      // isPublic is the publish switch: only checked rows go live.
      // (Upstream applied this only on Vercel production; a static
      // export build IS the production publish, so it applies always.)
      property: 'isPublic',
      checkbox: {
        equals: true
      }
    }
  ]

  if (slug) {
    and.push({
      property: 'slug',
      rich_text: {
        equals: slug,
      }
    })
  }

  if (tag) {
    and.push({
      property: 'tags',
      multi_select: {
        contains: tag,
      }
    })
  }

  // Notion returns at most 100 rows per call — page through the rest.
  const results: any[] = []
  let cursor: string | undefined = undefined
  while (true) {
    const { results: pageResults, next_cursor }: any = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: and
      },
      sorts: [
        {
          property: 'published',
          direction: 'descending'
        }
      ],
      start_cursor: cursor,
      page_size: 100
    })
    results.push(...pageResults)
    if (!next_cursor) break
    cursor = next_cursor
  }

  return { results }
}

export const fetchBlocksByPageId = async (pageId: string) => {
  const data = []
  let cursor = undefined

  while (true) {
    const { results, next_cursor }: any = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor
    })

    data.push(...results)
    if (!next_cursor) break
    cursor = next_cursor
  }

  return { results: data }
}
