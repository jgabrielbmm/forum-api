import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })
  it('should be able to edit a question', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question 1'),
    )

    await questionsRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: 'author-1',
      title: 'Test question',
      content: 'Content test',
    })

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'Test question',
      content: 'Content test',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionsRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: 'author-2',
      title: 'Test question',
      content: 'Content test',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
