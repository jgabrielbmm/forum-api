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
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Title',
      content: 'content',
    })

    expect(question.content).toEqual('content')
    expect(question.id).toBeTruthy()
  })
})
