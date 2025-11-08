import AIToolCard from './AIToolCard';

const AIToolsSection = () => {
  const tools = [
    {
      id: 'career-qa',
      type: 'chat',
      icon: '💬',
      title: 'AI Career Q&A Chat',
      description: 'Ask career questions',
      buttonText: 'Ask Now',
    },
    {
      id: 'resume-analyzer',
      type: 'resume',
      icon: '📄',
      title: 'AI Resume Analyzer',
      description: 'Improve your resume',
      buttonText: 'Analyze Now',
    },
    {
      id: 'roadmap-generator',
      type: 'roadmap',
      icon: '🗺️',
      title: 'Career Roadmap Generator',
      description: 'Build your roadmap',
      buttonText: 'Generate Now',
    },
    {
      id: 'cover-letter',
      type: 'cover',
      icon: '📝',
      title: 'Cover Letter Generator',
      description: 'Write a cover letter',
      buttonText: 'Create Now',
    },
  ];

  const handleToolClick = (tool) => {
    console.log('Tool clicked:', tool.id);
    // Add navigation or modal logic here
  };

  return (
    <section className="mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available AI Tools</h2>
        <p className="text-gray-600">
          Start Building and Shape Your Career with this exclusive AI Tools
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <AIToolCard key={tool.id} tool={tool} onClick={handleToolClick} />
        ))}
      </div>
    </section>
  );
};

export default AIToolsSection;
