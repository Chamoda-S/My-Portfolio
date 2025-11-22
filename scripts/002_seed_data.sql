-- Insert sample about content
insert into public.portfolio_content (section, title, content, order_index)
values 
  (
    'about',
    'Welcome to My Universe',
    '{"subtitle": "Product & Project Manager", "bio": "I transform ideas into reality through strategic planning and execution. With expertise in agile methodologies and cross-functional team leadership, I deliver products that users love.", "highlights": ["5+ years experience", "Led 20+ successful projects", "Passionate about innovation"]}'::jsonb,
    1
  );

-- Insert sample contact content
insert into public.portfolio_content (section, title, content, order_index)
values 
  (
    'contact',
    'Get In Touch',
    '{"email": "hello@example.com", "linkedin": "linkedin.com/in/yourname", "github": "github.com/yourname", "message": "Let''s collaborate on something amazing!"}'::jsonb,
    1
  );

-- Insert sample projects
insert into public.projects (title, description, tech_stack, project_url, order_index)
values 
  (
    'E-Commerce Platform Redesign',
    'Led the complete redesign of a major e-commerce platform, resulting in 40% increase in conversion rates and improved user satisfaction scores.',
    array['Product Strategy', 'User Research', 'Agile', 'A/B Testing'],
    'https://example.com',
    1
  ),
  (
    'Mobile App Launch',
    'Managed end-to-end development and launch of a mobile application serving 100K+ users. Coordinated with design, engineering, and marketing teams.',
    array['Mobile Product', 'React Native', 'API Design', 'Analytics'],
    'https://example.com',
    2
  ),
  (
    'AI-Powered Analytics Dashboard',
    'Developed product roadmap and requirements for an AI-powered analytics tool. Successfully launched MVP in 3 months with positive user feedback.',
    array['AI/ML', 'Data Analytics', 'Product Design', 'Stakeholder Management'],
    'https://example.com',
    3
  );

-- Insert sample skills
insert into public.skills (name, category, proficiency, order_index)
values 
  ('Product Strategy', 'Product Management', 95, 1),
  ('Agile & Scrum', 'Product Management', 90, 2),
  ('User Research', 'Product Management', 85, 3),
  ('Roadmap Planning', 'Product Management', 90, 4),
  ('JIRA', 'Tools', 85, 5),
  ('Figma', 'Tools', 80, 6),
  ('Google Analytics', 'Tools', 85, 7),
  ('SQL', 'Technical', 75, 8),
  ('API Design', 'Technical', 70, 9),
  ('Data Analysis', 'Technical', 80, 10);
