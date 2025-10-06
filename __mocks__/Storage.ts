export const saveCarsToStorage = jest.fn(async (cars: any) => {
  return Promise.resolve();
});

export const getCarsFromStorage = jest.fn(async () => {
  return Promise.resolve(null);
});

