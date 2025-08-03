'use client';
import type { ResumeAnalysisOutput } from '@/ai/schemas';
import React, { forwardRef } from 'react';
import { Mail, Phone, Linkedin, Github, Globe, Briefcase, Star, GraduationCap } from 'lucide-react';

interface TemplateProps {
  data: ResumeAnalysisOutput;
}

export const ModernTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  return (
    <div ref={ref} className="p-6 font-sans bg-white text-gray-900 w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
          <header className="text-center mb-8">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase text-blue-600 mb-3 flex items-center gap-2"><Mail size={18} /> Contact</h2>
            <div className="space-y-2 text-sm">
              {data.contact.email && <p className="break-all">{data.contact.email}</p>}
              {data.contact.phone && <p>{data.contact.phone}</p>}
              {data.contact.linkedin && <p className="break-all">{data.contact.linkedin}</p>}
              {data.contact.github && <p className="break-all">{data.contact.github}</p>}
              {data.contact.website && <p className="break-all">{data.contact.website}</p>}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase text-blue-600 mb-3 flex items-center gap-2"><Star size={18} /> Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase text-blue-600 mb-3 flex items-center gap-2"><GraduationCap size={18} /> Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                  {edu.year && <p className="text-gray-500 text-xs">{edu.year}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-2 py-6 pr-6">
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-gray-800">Summary</h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-gray-800 flex items-center gap-2"><Briefcase size={22} /> Experience</h2>
            <div className="space-y-6">
              {data.experiences.map((exp, index) => (
                <div key={index} className="text-sm relative pl-4">
                   <div className="absolute left-0 top-1 h-full w-0.5 bg-gray-200"></div>
                   <div className="absolute left-[-5px] top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  <h3 className="text-xl font-semibold">{exp.title}</h3>
                  <p className="font-medium text-md text-gray-600">{exp.company}</p>
                  <p className="mt-2 text-gray-700 leading-normal">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});

ModernTemplate.displayName = 'ModernTemplate';
