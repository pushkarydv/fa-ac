export const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

export const logStyled = (message) => {
  console.log(`\x1b[33m[${new Date().toISOString()}] ${message}\x1b[0m`);
};

export const greet = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    logStyled('Good Morning!');
  } else if (currentHour < 18) {
    logStyled('Good Afternoon!');
  } else {
    logStyled('Good Evening!');
  }
};