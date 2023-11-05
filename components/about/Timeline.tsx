'use client';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Button, CardContent } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { Modal } from '@/components/core/Modal';
import { Connector } from '../timeline/Connector/Connector';

type TimelineCardProps = {
  title: string;
  subtitle: string;
  date: string;
  align?: 'left' | 'right';
  children?: React.ReactNode;
};

function TimelineCard({
  title,
  subtitle,
  date,
  align,
  children,
}: TimelineCardProps): JSX.Element {
  align = align || 'left';
  return (
    <>
      <CardContent className="flex flex-col gap-1">
        <h3 className="font-wise text-lg sm:text-xl md:text-2xl">{title}</h3>
        <p className="font-wise text-xs sm:text-sm ">{subtitle}</p>
        <div
          className={clsx(
            'flex flex-row',
            align === 'left' ? 'justify-start' : 'justify-end',
          )}
        >
          <div className="w-fit rounded-md bg-romaingrx-emphasis p-2">
            <p className="font-wise text-xs sm:text-sm">{date}</p>
          </div>
        </div>
        {children && (
          <div className="flex flex-row justify-between">{children}</div>
        )}
      </CardContent>
    </>
  );
}

function ModalTimelineParagraph({
  title,
  subtitle,
  date,
  children,
}: TimelineCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <>
      <Button
        className="text-md font-wise text-inherit"
        onClick={() => setIsExpanded(true)}
      >
        Read more
      </Button>
      <Modal
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex flex-col gap-2">
          <div className="text-md flex justify-center font-wise">{title}</div>
          <hr className="border-romaingrx-brand" />
          {children}
          <hr className="border-romaingrx-brand" />
          <div className="flex flex-row justify-between">
            <p className="text-xs font-semibold sm:text-sm">{subtitle}</p>
            <p className="text-xs font-semibold sm:text-sm">{date}</p>
          </div>
        </div>
      </Modal>
    </>
  );
}

function TimelineParagraph({
  title,
  subtitle,
  date,
  children,
}: TimelineCardProps): JSX.Element {
  return (
    <>
      <div className="md:hidden">
        <ModalTimelineParagraph title={title} subtitle={subtitle} date={date}>
          {children}
        </ModalTimelineParagraph>
      </div>
      <p className="hidden text-justify text-xs sm:text-sm md:block">
        {children}
      </p>
    </>
  );
}

type TimelineSurroundingsProps = {
  first: React.ReactNode;
  second: React.ReactNode;
  timelineSeparator?: boolean | undefined;
};

function TimelineSurroundings({
  first,
  second,
  timelineSeparator,
}: TimelineSurroundingsProps): JSX.Element {
  timelineSeparator =
    timelineSeparator === undefined ? true : timelineSeparator;
  return (
    <>
      <TimelineItem>
        <TimelineOppositeContent className="flex flex-col justify-center pt-2 md:pt-8">
          {first}
        </TimelineOppositeContent>
        <TimelineSeparator>
          {timelineSeparator && <TimelineDot />}
          <Connector />
        </TimelineSeparator>
        <TimelineContent className="flex flex-col justify-center pt-2 md:pt-8">
          {second}
        </TimelineContent>
      </TimelineItem>
    </>
  );
}

type TimelineJobItemProps = {
  title: string;
  subtitle: string;
  date: string;
  align?: 'left' | 'right';
  timelineSeparator?: boolean;
  description: React.ReactNode | string;
};

function TimelineJobItem({
  title,
  subtitle,
  date,
  align,
  timelineSeparator,
  description,
}: TimelineJobItemProps): JSX.Element {
  return (
    <>
      <TimelineSurroundings
        first={
          <TimelineCard
            title={title}
            subtitle={subtitle}
            date={date}
            align={align}
          />
        }
        second={
          <TimelineParagraph title={title} subtitle={subtitle} date={date}>
            {description}
          </TimelineParagraph>
        }
        timelineSeparator={timelineSeparator}
      />
    </>
  );
}

function TimelineTitle({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <h1 className="rounded-md bg-romaingrx-emphasis px-2 py-1 font-wise text-4xl text-romaingrx-brand ">
        {children}
      </h1>
    </>
  );
}

function ProjectsTimeline() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center">
          <TimelineTitle>Projects</TimelineTitle>
        </div>
        <Timeline position="alternate-reverse">
          <TimelineJobItem
            title="Co-Creator and Vice President"
            subtitle="Lausanne AI Alignemnt Group"
            date="Jan 2023 - Now"
            description={
              <>
                Co-created and leading a volunteer-driven organization focused
                on AI safety and alignment, organizing talks, round tables,
                seminars and bootcamps to foster knowledge exchange and raise
                awareness about AI risks. During which I:
                <ul className="list-inside list-disc pl-4">
                  <li>
                    Successfully led the AI Safety Fundamentals from BlueDot
                    Impact, implementing the AI Alignment Curriculum.
                  </li>
                  <li>
                    Organized a 2-week AI Safety bootcamp in Sep. 2023, aiming
                    to skill up 20 motivated participants and encourage them to
                    work in the field of AI Safety. Delivered in-depth training
                    on the technical aspects of Transformer architecture,
                    including mechanistic interpretability (Induction and
                    Indirect Object Identification circuits) and provided
                    lessons on RL, RLHF and jailbreaking of LLMs.
                  </li>
                </ul>
              </>
            }
            timelineSeparator={false}
          />
        </Timeline>
      </div>
    </>
  );
}

function ExperienceTimeline() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center">
          <TimelineTitle>Experience</TimelineTitle>
        </div>
        <Timeline position="alternate">
          <TimelineJobItem
            title="Data Officer"
            subtitle="NCCR Catalysis (EPFL/ETHZ)"
            date="Jan 2023 - Now"
            description="In my role as a Data Officer at NCCR Catalysis (EPFL/ETHZ), I collaborate with 50 labs across Switzerland to standardize practices and optimize data management. I am developing a technique for uniform catalyst storage and sharing, and facilitating open science through AI model platforms. Additionally, I am co-authoring a manuscript detailing our research on ML-based detection of metallic atoms in microscope images."
            align="right"
            timelineSeparator={false}
          />
          <TimelineJobItem
            title="Fullstack software engineer"
            subtitle="Graux Guitar Loops"
            date="Jul 2022 - Now"
            description="Created and launched SpicyX, a streaming platform for guitar loops. Leveraged NextJS, MongoDB, and Vercel to build a scalable platform, attracting over 100+ monthly subscribed producers."
          />
          <TimelineJobItem
            title="Teaching Assistant"
            subtitle="École Polytechnique de Louvain"
            date="Sep 2020 - Jun 2021"
            description={
              <>
                Gave practice sessions to students (between 20 and 50 per
                session) for the following courses:
                <ul className="list-inside list-disc pl-4">
                  <li>Algorithms and data structures</li>
                  <li>Discrete math and probability</li>
                  <li>Numerical methods</li>
                  <li>Signals and systems</li>
                  <li>Python</li>
                </ul>
              </>
            }
            align="right"
          />
          <TimelineJobItem
            title="Computer Vision Internship"
            subtitle="Aerospacelab"
            date="Jul 2020 - Sep 2020"
            description="Developed and deployed a Mask-RCNN model for satellite image analysis, encompassing detection, segmentation, and area computation. Integrated the model with location information obtained from OpenStreetMap for accurate image matching. The model is currently in production."
          />
        </Timeline>
      </div>
    </>
  );
}

function EducationTimeline() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center">
          <TimelineTitle>Education</TimelineTitle>
        </div>
        <Timeline position="alternate">
          <TimelineJobItem
            title="M.S. Data Science Engineering"
            subtitle="École Polytechnique Fédérale de Lausanne"
            date="Sep 2021 - Sep 2022"
            description='One year exchange at EPFL, where I undertook a master thesis titled "Point cloud compression for DNA based storage" and achieved a grade of 5.75/6. This research involved building an end-to-end point cloud compressor for quaternary based coding while adhering to DNA sequencing, storage, and synthesis constraints. In addition to my thesis, I completed the courses Cryptography and security, Information security and privacy, Decentralized systems and Seminar in advanced topics in machine learning. Took part in the Effective Altruism Lausanne and GNU Generation associations.'
            align="right"
            timelineSeparator={false}
          />
          <TimelineJobItem
            title="M.S. Data Science Engineering"
            subtitle="École Polytechnique de Louvain"
            date="Sep 2020 - Sep 2022"
            description="Master degree in data science with a specialization in cryptography and computer systems. Grade: Cum Laude."
          />
          <TimelineJobItem
            title="B. Sc. Engineering"
            subtitle="École Polytechnique de Louvain"
            date="Sep 2017 - Sep 2020"
            description="Bachelor degree in engineering with a specialization in applied mathematics and computer science. Grade: Cum Laude."
            align="right"
          />
        </Timeline>
      </div>
    </>
  );
}

export default function AboutTimeline() {
  return (
    <>
      <div className="flex flex-col justify-center">
        <ProjectsTimeline />
        <ExperienceTimeline />
        <EducationTimeline />
      </div>
    </>
  );
}
