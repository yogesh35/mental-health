-- Insert Sample Mental Health Resources
USE mental_health_resources;

-- Insert sample resources
INSERT INTO resources (title, description, content, type, category_id, url, thumbnail, author, duration_minutes, difficulty_level, is_featured, is_active) VALUES
-- Anxiety Management Resources
('Deep Breathing Techniques for Anxiety', 'Learn effective breathing exercises to manage anxiety and panic attacks in real-time.', 'Deep breathing is one of the most effective immediate techniques for managing anxiety. This guide covers 4-7-8 breathing, box breathing, and diaphragmatic breathing techniques that can help calm your nervous system within minutes.', 'article', 1, 'https://example.com/breathing-techniques', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'Dr. Sarah Johnson', 10, 'beginner', true, true),

('Progressive Muscle Relaxation Guide', 'A step-by-step guide to releasing physical tension and reducing anxiety through muscle relaxation.', 'Progressive Muscle Relaxation (PMR) involves systematically tensing and relaxing different muscle groups to reduce physical tension and anxiety. This comprehensive guide provides scripts and techniques for full-body relaxation.', 'video', 1, 'https://example.com/pmr-guide', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'Mental Health Institute', 25, 'beginner', false, true),

('Cognitive Behavioral Therapy for Anxiety', 'Evidence-based CBT techniques to challenge anxious thoughts and change negative thinking patterns.', 'Cognitive Behavioral Therapy (CBT) is a highly effective treatment for anxiety disorders. This resource covers thought challenging, cognitive restructuring, and behavioral experiments to help manage anxiety symptoms.', 'guide', 1, 'https://example.com/cbt-anxiety', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', 'Dr. Michael Chen', 45, 'intermediate', true, true),

-- Depression Support Resources
('Understanding Depression: Signs and Symptoms', 'Comprehensive guide to recognizing depression symptoms and understanding when to seek help.', 'Depression affects millions of people worldwide. This resource helps you understand the different types of depression, recognize symptoms, and learn about available treatment options including therapy, medication, and lifestyle changes.', 'article', 2, 'https://example.com/depression-guide', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', 'Depression Alliance', 20, 'beginner', true, true),

('Behavioral Activation for Depression', 'Learn how to increase positive activities and break the cycle of depression through behavioral techniques.', 'Behavioral Activation is an evidence-based approach that helps combat depression by increasing engagement in meaningful activities. This guide provides worksheets and strategies to help you build a more active, fulfilling routine.', 'exercise', 2, 'https://example.com/behavioral-activation', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Dr. Emily Rodriguez', 30, 'intermediate', false, true),

-- Stress Relief Resources
('5-Minute Stress Relief Techniques', 'Quick and effective stress management techniques you can use anywhere, anytime.', 'When stress hits, you need quick relief. This collection of 5-minute techniques includes breathing exercises, mindfulness practices, and physical movements that can help you reset and refocus during stressful moments.', 'tool', 3, 'https://example.com/quick-stress-relief', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'Stress Management Center', 5, 'beginner', true, true),

('Workplace Stress Management', 'Strategies for managing stress in professional environments and maintaining work-life balance.', 'Work-related stress is increasingly common. This comprehensive guide covers time management, boundary setting, communication strategies, and stress reduction techniques specifically designed for workplace challenges.', 'article', 3, 'https://example.com/workplace-stress', 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400', 'Corporate Wellness Team', 35, 'intermediate', false, true),

-- Mindfulness Resources
('Introduction to Mindfulness Meditation', 'A beginner-friendly guide to starting a mindfulness practice for mental well-being.', 'Mindfulness meditation has been shown to reduce stress, anxiety, and depression while improving overall well-being. This guide covers basic techniques, common challenges, and how to establish a sustainable practice.', 'audio', 4, 'https://example.com/mindfulness-intro', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'Mindful Living Institute', 15, 'beginner', true, true),

('Body Scan Meditation Practice', 'Guided body scan meditation to develop awareness and release physical tension.', 'Body scan meditation helps develop mindful awareness of physical sensations while promoting relaxation. This guided practice takes you through a systematic scan of your entire body, helping you notice and release tension.', 'audio', 4, 'https://example.com/body-scan', 'https://images.unsplash.com/photo-1540206395-68808572332f?w=400', 'Meditation Masters', 20, 'beginner', false, true),

-- Sleep Health Resources
('Sleep Hygiene Essentials', 'Evidence-based tips for improving sleep quality and establishing healthy sleep habits.', 'Good sleep is crucial for mental health. This resource covers sleep hygiene principles, bedroom optimization, bedtime routines, and strategies for dealing with common sleep disruptors.', 'guide', 5, 'https://example.com/sleep-hygiene', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400', 'Sleep Foundation', 25, 'beginner', true, true),

-- Self-Care Resources
('Daily Self-Care Checklist', 'A practical guide to incorporating self-care practices into your daily routine.', 'Self-care is essential for maintaining mental health. This interactive checklist helps you identify and implement self-care practices that fit your lifestyle, covering physical, emotional, social, and spiritual well-being.', 'tool', 7, 'https://example.com/self-care-checklist', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Wellness Institute', 10, 'beginner', false, true),

('Building Resilience and Emotional Strength', 'Learn strategies to build emotional resilience and cope with life challenges more effectively.', 'Resilience is the ability to bounce back from adversity. This comprehensive guide covers resilience-building strategies, emotional regulation techniques, and ways to develop a growth mindset for better mental health.', 'article', 7, 'https://example.com/resilience-building', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', 'Dr. Lisa Park', 40, 'intermediate', true, true),

-- Crisis Support Resources
('Crisis Helpline Numbers', 'Important emergency contact numbers and crisis support resources available 24/7.', 'If you are experiencing a mental health crisis, immediate help is available. This resource provides crisis helpline numbers, text support options, and guidance on when to seek emergency care.', 'article', 8, 'https://example.com/crisis-helplines', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', 'Crisis Support Network', 5, 'beginner', true, true),

('Suicide Prevention and Support', 'Resources for suicide prevention, warning signs, and how to help someone in crisis.', 'Suicide prevention saves lives. This resource covers warning signs, how to have conversations about suicide, crisis intervention techniques, and resources for both individuals at risk and their support networks.', 'guide', 8, 'https://example.com/suicide-prevention', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'National Suicide Prevention', 30, 'advanced', true, true),

-- Relationship Support Resources
('Healthy Communication in Relationships', 'Learn effective communication skills to strengthen your relationships and resolve conflicts.', 'Healthy communication is the foundation of strong relationships. This guide covers active listening, expressing needs assertively, conflict resolution, and building emotional intimacy with partners, family, and friends.', 'video', 6, 'https://example.com/healthy-communication', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', 'Relationship Counseling Center', 35, 'intermediate', false, true);

-- Insert resource-tag relationships
INSERT INTO resource_tags (resource_id, tag_id) VALUES
-- Breathing techniques
(1, 1), (1, 3), (1, 7), (1, 13),
-- PMR Guide
(2, 1), (2, 9), (2, 7), (2, 13),
-- CBT for Anxiety
(3, 2), (3, 6), (3, 11), (3, 14),
-- Understanding Depression
(4, 1), (4, 2), (4, 11), (4, 13),
-- Behavioral Activation
(5, 2), (5, 4), (5, 8), (5, 13),
-- 5-Minute Stress Relief
(6, 1), (6, 3), (6, 7), (6, 13),
-- Workplace Stress
(7, 2), (7, 4), (7, 11), (7, 13),
-- Mindfulness Intro
(8, 1), (8, 4), (8, 10), (8, 13),
-- Body Scan
(9, 1), (9, 7), (9, 10), (9, 13),
-- Sleep Hygiene
(10, 1), (10, 2), (10, 11), (10, 13),
-- Self-Care Checklist
(11, 1), (11, 4), (11, 8), (11, 13),
-- Building Resilience
(12, 2), (12, 4), (12, 11), (12, 13),
-- Crisis Helplines
(13, 1), (13, 5), (13, 11), (13, 13),
-- Suicide Prevention
(14, 2), (14, 5), (14, 6), (14, 11),
-- Healthy Communication
(15, 2), (15, 8), (15, 9), (15, 13);

-- Display success message
SELECT 'Sample resources inserted successfully!' as Status;
SELECT COUNT(*) as Total_Resources FROM resources;
SELECT COUNT(*) as Total_Resource_Tags FROM resource_tags;