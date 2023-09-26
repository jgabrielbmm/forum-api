import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      content: 'New answer',
      questionId: '1',
      instructorId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
  })
})
