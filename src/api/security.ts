import { httpGet } from '@/utils/request'

export enum VerifyCodeType {
  IMAGE_BLOB,
  SVG_XML
}

export type VerifyCode = {
  uuid: string
  data: string
  code_type: VerifyCodeType
}

export function getVerifyCode() {
  return httpGet<VerifyCode>('/security/verify_code')
}
