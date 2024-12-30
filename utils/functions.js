export const styledLogger = (text) => {
  console.log(`\x1b[33m${text}\x1b[0m`);
};

export const greet = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    styledLogger('Good Morning!');
  } else if (currentHour < 18) {
    styledLogger('Good Afternoon!');
  } else {
    styledLogger('Good Evening!');
  }
};
