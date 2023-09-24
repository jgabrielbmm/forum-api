import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let answersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })
  it('should be able to delete an answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId('author 1'),
      },
      new UniqueEntityId('answer 1'),
    )

    await answersRepository.create(answer)

    await sut.execute({
      authorId: 'author 1',
      answerId: 'answer 1',
    })

    expect(answersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId('author 1'),
      },
      new UniqueEntityId('answer 1'),
    )

    await answersRepository.create(answer)

    expect(() =>
      sut.execute({
        authorId: 'author 2',
        answerId: 'answer 1',
      }),
    ).rejects.toBeInstanceOf(Error)

    expect(answersRepository.items).toHaveLength(1)
  })
})
