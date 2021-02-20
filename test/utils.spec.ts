import inferCode from '../src/utils/inferCode'

describe('Utils', () => {
  describe('Code Inference', () => {
    it('should correctly infer the command code', () => {
      expect(inferCode('PingCommand')).toBe('ping')
      expect(inferCode('UPPERCASECommand')).toBe('uppercase')
      expect(inferCode('CommandCommand')).toBe('command')
      expect(inferCode('MultipleWordsCommand')).toBe('multiple-words')
    })
  })
})
