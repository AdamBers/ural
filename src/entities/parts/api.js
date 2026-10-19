import axios from 'axios';
export async function searchParts({ number, brand, mode }, signal) {
  const { data } = await axios.get('/api/search', { params: { number, brand, mode }, signal, timeout: 25000 });
  return data.goods;
}
export const getErrorMessage = error => error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Сервис не ответил вовремя. Попробуйте ещё раз.' : 'Не удалось загрузить данные. Проверьте соединение и повторите поиск.');
