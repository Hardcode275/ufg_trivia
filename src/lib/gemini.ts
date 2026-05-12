import { getRandomQuestions } from './questions';

export async function generateTriviaQuestions(_topic: string, count: number = 15) {
  return getRandomQuestions(count);
}
