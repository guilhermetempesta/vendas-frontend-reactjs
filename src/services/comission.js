import { api } from './api'

export const getComissions = async (filters) => {
  try {
    const queryParams = [];
    let query = null;

    if (filters) {
      if (filters.initialDate) {
        queryParams.push(`initialDate=${filters.initialDate}`);
      }
      if (filters.finalDate) {
        queryParams.push(`finalDate=${filters.finalDate}`);
      }
      if (filters.user !== '') {
        queryParams.push(`user=${filters.user}`);
      }
      query = queryParams.join('&');
    }
    
    console.log('query:', query);

    const response = (query) ? await api.get(`/reports/comissions?${query}`) : await api.get('/reports/comissions');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}


