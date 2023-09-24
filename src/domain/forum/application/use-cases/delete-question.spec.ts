import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })
  it('should be able to delete a question', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId('author 1'),
      },
      new UniqueEntityId('question 1'),
    )

    await questionsRepository.create(question)

    await sut.execute({
      authorId: 'author 1',
      questionId: 'question 1',
    })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId('author 1'),
      },
      new UniqueEntityId('question 1'),
    )

    await questionsRepository.create(question)

    expect(() =>
      sut.execute({
        authorId: 'author 2',
        questionId: 'question 1',
      }),
    ).rejects.toBeInstanceOf(Error)

    expect(questionsRepository.items).toHaveLength(1)
  })
})
