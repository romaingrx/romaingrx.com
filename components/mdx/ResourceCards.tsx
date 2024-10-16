import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@nextui-org/react';
import { GithubIcon, HuggingFaceIcon } from '../core/Icon/Icon';
import { FaDatabase } from 'react-icons/fa';
import { Dataset } from '@/.contentlayer/generated';

interface ResourceCardsProps {
  githubProject?: string;
  huggingfaceModel?: string;
  datasets?: Dataset[];
}

const ResourceCards: React.FC<ResourceCardsProps> = ({
  githubProject,
  huggingfaceModel,
  datasets,
}) => {
  if (!githubProject && !huggingfaceModel && (!datasets || datasets.length === 0)) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {githubProject && (
        <Link href={githubProject}>
          <Card isHoverable className="w-fit">
            <CardBody>
              <div className="flex items-center gap-2">
                <GithubIcon className="h-5 w-5" />
                <span>View code on GitHub</span>
              </div>
            </CardBody>
          </Card>
        </Link>
      )}
      {huggingfaceModel && (
        <Link href={huggingfaceModel}>
          <Card isHoverable className="w-fit">
            <CardBody>
              <div className="flex items-center gap-2">
                <HuggingFaceIcon className="h-5 w-5" />
                <span>View model on Hugging Face</span>
              </div>
            </CardBody>
          </Card>
        </Link>
      )}
      {datasets && datasets.map((dataset) => (
        <Link key={dataset.name} href={dataset.link ?? ''}>
          <Card isHoverable className="w-fit">
            <CardBody>
              <div className="flex items-center gap-2">
                <FaDatabase className="h-5 w-5" />
                <div className="flex flex-col">
                  <span>{dataset.name}</span>
                  <span className="text-sm text-romaingrx-typeface-secondary">
                    {dataset.description}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ResourceCards;
