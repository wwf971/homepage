import React from 'react'
import { Node } from '@/markdown-yaml/Node.jsx'
import { useAssetStore } from '@/asset/Asset.js'
import { getIntroBulletBlock } from '@/home/workUtils.js'
import { ASSET_PATHS } from '../../config.js'
import './CVWork.css'

const CVWork = () => {
  const workAsset = useAssetStore((state) => state.assets[ASSET_PATHS.HOME_WORK] || null);

  const getWorkDataFiltered = () => {
    if (!workAsset?.content?.data) return null;

    const rawData = workAsset.content.data;
    const dataFiltered = rawData.filter(item => item.type === 'work');
    const dataTransformed = [];

    dataFiltered.forEach((item) => {
      const introKey = Object.keys(item).find(key =>
        key === 'intro' || key.startsWith('intro[')
      );
      const introData = introKey ? item[introKey] : null;
      const bulletBlock = getIntroBulletBlock(introData);

      const isOngoing = item.time?.end?.present || !item.time?.end?.year;
      const startMonth = String(item.time.start.month).padStart(2, '0');
      const timeStr = isOngoing
        ? `Since ${item.time.start.year}/${startMonth}`
        : `${item.time.start.year}/${startMonth}-${item.time.end.year}/${String(item.time.end.month).padStart(2, '0')}`;

      dataTransformed.push({
        [`${timeStr}[self=top-right]`]: [{
          [`${item.company}[selfClass=cv-work-company,child=ul]`]: bulletBlock ? [bulletBlock] : []
        }]
      });
    });

    return dataTransformed;
  };

  const dataFiltered = getWorkDataFiltered();

  if (!dataFiltered || dataFiltered.length === 0) {
    return null;
  }

  return (
    <div className="work-section">
      <div className="cv-section-title cv-work-section-title">Work</div>
      <div className="cv-work-node-wrap">
        <Node data={dataFiltered} rootStyle="default" />
      </div>
    </div>
  );
};

export default CVWork;
