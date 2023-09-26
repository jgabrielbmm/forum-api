import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })
  it('should be able to create a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Title',
      content: 'content',
    })

    expect(result.isRight()).toBe(true)
    expect(questionsRepository.items[0]).toEqual(result.value?.question)
  })
})
