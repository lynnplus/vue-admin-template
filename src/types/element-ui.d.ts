import type { TableColumnCtx } from 'element-plus'

export type ElTableColumnItem<T> = {
  row: T
  column: TableColumnCtx<T>
  $index: number
}

export type ElTableSortOrder = 'ascending' | 'descending' | null

export type ElSortChangeEvent<T = any> = { column: T; prop: keyof T; order: ElTableSortOrder }
