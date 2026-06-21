export function getIntroBulletBlock(introData) {
  if (!introData || !Array.isArray(introData)) {
    return null;
  }

  const ulBlock = introData.find((entry) =>
    typeof entry === 'object' &&
    entry !== null &&
    Object.keys(entry).some((key) => key.includes('child=ul'))
  );

  if (ulBlock) {
    return ulBlock;
  }

  if (introData.length === 1 && typeof introData[0] === 'object') {
    return introData[0];
  }

  return null;
}

export function buildWorkDisplayContent(item, introData, companyClassName = 'work-company') {
  const content = [`${item.company}[selfClass=${companyClassName}]`];
  const bulletBlock = getIntroBulletBlock(introData);

  if (bulletBlock) {
    content.push(bulletBlock);
  }

  return content;
}
