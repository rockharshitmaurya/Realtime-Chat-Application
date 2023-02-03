const generateDiceBearAvataaars = (seed) =>
  `https://avatars.dicebear.com/api/avataaars/${seed}.svg`;

export const generateAvatar = () => {
  const data = [];
  for (let i = 0; i < 4; i++) {
    const res = generateDiceBearAvataaars(Math.round(Math.random() * 1000));
    data.push(res);
  }
  return data;
};
