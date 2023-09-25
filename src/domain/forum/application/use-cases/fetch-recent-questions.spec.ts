import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2022, 0, 20),
      }),
    )
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2022, 2, 23),
      }),
    )
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2022, 0, 25),
      }),
    )

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 2, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 25) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await questionsRepository.create(makeQuestion())
    }

    const { questions } = await sut.execute({
      page: 2,
    })

    expect(questions).toHaveLength(2)
  })
})
