import React from 'react';
import NodeRoot from '@/markdown-yaml/NodeRoot.jsx';
import { buildWorkDisplayContent } from '@/home/workUtils.js';
import './Work.css';

function Work({ workAsset }) {
  const getWorkDataFiltered = () => {
    if (!workAsset?.content?.data) return null;

    const rawData = workAsset.content.data;
    const dataFiltered = rawData.filter(item => item.type === 'work');

    const dataTransformed = dataFiltered.map((item) => {
      const isOngoing = item.time?.end?.present || !item.time?.end?.year;
      const displayKey = isOngoing ? 'Present' : `${item.time.end.year}`;

      const introKey = Object.keys(item).find(key =>
        key === 'intro' || key.startsWith('intro[')
      );
      const introData = introKey ? item[introKey] : null;

      return {
        [displayKey]: buildWorkDisplayContent(item, introData)
      };
    });

    return dataTransformed;
  };

  const parseWorkCategoryStyle = (categoryName) => {
    return {
      name: categoryName,
      selfStyle: 'default',
      childStyle: 'plain-list'
    };
  };

  const dataFiltered = getWorkDataFiltered();

  if (!dataFiltered || dataFiltered.length === 0) {
    return (
      <div className="work-loading">
        No work data available...
      </div>
    );
  }

  return (
    <div className="work">
      <NodeRoot
        data={dataFiltered}
        title="Work"
        parseCategoryStyle={parseWorkCategoryStyle}
        lineAboveFirstRoot={{
          height: '10px',
          text: 'future',
          textStyle: { color: '#888' },
          lineStyle: { background: '#888' }
        }}
        lineBelowLastRoot={{
          height: '40px',
          text: 'past',
          textStyle: { color: '#888' },
          lineStyle: { background: '#888' }
        }}
        addDividerLine={false}
      />
    </div>
  );
}

export default Work;
