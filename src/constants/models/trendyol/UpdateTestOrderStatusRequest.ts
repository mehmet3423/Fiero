export interface UpdateTestOrderStatusRequest {
  lines: UpdateTestOrderStatusLine[];
  params?: Record<string, string>;
  status: string;
}

export interface UpdateTestOrderStatusLine {
  lineId: number;
  quantity: number;
}