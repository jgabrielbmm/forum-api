import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })
  it('should be able to edit an answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer 1'),
    )

    await answersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-1',
      content: 'Content test',
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: 'Content test',
    })
  })

  it('should not be able to edit an answer from another user', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
      content: 'Content test',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
