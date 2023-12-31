export const onlyNumbers = (text) => {
  var numbers = ''; 
  numbers = text.replace(/[^0-9]/g,'');
  return numbers;
};

export const phoneMask = (value) => {
  if ((value===null)||(value==='')) {
    return null
  }
  var r = value.replace(/\D/g, "");
  r = r.replace(/^0/, "");
  if (r.length > 10) {
    r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (r.length > 5) {
    r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (r.length > 2) {
    r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
  } else {
    r = r.replace(/^(\d*)/, "($1");
  }
  return r;
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const stringAvatar = (name, color) => {
  return {
    sx: {
      bgcolor: stringToColor(color),
      // fontWeight: "500"
    },
    children: `${name.split(' ')[0][0]}`,
  };
}

export const ufList = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MS','MT','MG',
'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export const formatDatePtBr = (date) => {                      
  const formatDate = new Date(date);
  return formatDate.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
};

export const currentDate = () => {
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() - 3 * 60 * 60 * 1000);
  return currentDate;
}

export const firstDayOfMonth = () => {
  const now = currentDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return firstDay;
};

export const isWithinDateLimit = (dateToCheck, daysLimit) => {
  // Obtém a data atual
  const currentDate = new Date();

  // Formate a data passada para o formato "yyyy-MM-dd" e crie um objeto Date
  const formattedDateToCheck = new Date(dateToCheck);

  // Define a diferença máxima em milissegundos com base no limite em dias
  const maxDifference = daysLimit * 24 * 60 * 60 * 1000;
  
  // Calcula a diferença entre a data atual e a data passada
  const difference = currentDate - formattedDateToCheck;
  
  // Verifica se a diferença está dentro do limite máximo
  return difference <= maxDifference;
};
  
export const statusSuccess = [200, 201, 204]; 
export const statusWarning = [400, 403, 405];
    
export const months = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const getMonthAndYear = () => {
  const currentDate = new Date();
  const monthName = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return `${monthName} / ${currentYear}`;
}

export const extractAbbreviatedName = (fullName) => {
  const nameParts = fullName.split(' ');

  if (nameParts.length >= 2) {
    const firstName = nameParts[0];
    const firstLetterLastName = nameParts[1].charAt(0);
    const abbreviatedName = `${firstName} ${firstLetterLastName}.`;
    return abbreviatedName;
  }

  return fullName;
}
