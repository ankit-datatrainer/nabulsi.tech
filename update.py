import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add GSAP and Three.js
content = content.replace(
    '<script src="main.js"></script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>\n  <script src="main.js"></script>'
)

# 2. Fix Hero Section
hero_old = '''    <!-- ===== HERO SECTION ===== -->
    <section class="hero container section-spacing">
      <div class="blob blob-primary" style="top: -10%; left: -10%; width: 50vw; height: 50vw;"></div>
      <div class="blob blob-secondary" style="bottom: -20%; right: -10%; width: 60vw; height: 60vw;"></div>
      <div class="blob blob-tertiary" style="top: 20%; left: 30%; width: 40vw; height: 40vw;"></div>
      
      <h1 class="display-xl reveal-up">'''

hero_new = '''    <!-- ===== HERO SECTION ===== -->
    <section class="hero">
      <div class="blob blob-primary" style="top: -10%; left: -10%; width: 50vw; height: 50vw;"></div>
      <div class="blob blob-secondary" style="bottom: -20%; right: -10%; width: 60vw; height: 60vw;"></div>
      <div class="blob blob-tertiary" style="top: 20%; left: 30%; width: 40vw; height: 40vw;"></div>
      
      <div class="container section-spacing">
        <h1 class="display-xl reveal-up">'''

hero_old2 = '''        <a href="about.html" class="link-hover">Discover Our Approach</a>
      </div>
    </section>'''

hero_new2 = '''        <a href="about.html" class="link-hover">Discover Our Approach</a>
      </div>
      </div>
    </section>'''

content = content.replace(hero_old, hero_new).replace(hero_old2, hero_new2)

# 3. Stats Section
stats_old = '''    <!-- ===== STATS SECTION ===== -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item reveal-up">
            <h2 class="stat-number" data-count="120">0</h2>
            <p class="stat-label">Projects Delivered</p>
          </div>
          <div class="stat-item reveal-up" style="transition-delay: 0.1s">
            <h2 class="stat-number" data-count="50">0</h2>
            <p class="stat-label">Happy Clients</p>
          </div>
          <div class="stat-item reveal-up" style="transition-delay: 0.2s">
            <h2 class="stat-number" data-count="8">0</h2>
            <p class="stat-label">Years Experience</p>
          </div>
          <div class="stat-item reveal-up" style="transition-delay: 0.3s">
            <h2 class="stat-number" data-count="15">0</h2>
            <p class="stat-label">Awards Won</p>
          </div>
        </div>
      </div>
    </section>'''

stats_new = '''    <!-- ===== LUXURY STATS (Glassmorphism & Three.js) ===== -->
    <section class="stats-section ambient-glow-wrapper">
      <div id="stats-canvas-container"></div>
      <div class="container relative z-10">
        <div class="stats-grid">
          
          <div class="stat-glass-card magnetic">
            <div class="magnetic-inner">
              <div class="stat-number-wrapper">
                <span class="stat-number text-gradient" data-count="120">0</span><span class="stat-plus text-gradient">+</span>
              </div>
              <p class="stat-label">PROJECTS DELIVERED</p>
            </div>
          </div>

          <div class="stat-glass-card magnetic" style="transition-delay: 0.1s">
            <div class="magnetic-inner">
              <div class="stat-number-wrapper">
                <span class="stat-number text-gradient" data-count="50">0</span><span class="stat-plus text-gradient">+</span>
              </div>
              <p class="stat-label">HAPPY CLIENTS</p>
            </div>
          </div>

          <div class="stat-glass-card magnetic" style="transition-delay: 0.2s">
            <div class="magnetic-inner">
              <div class="stat-number-wrapper">
                <span class="stat-number text-gradient" data-count="8">0</span><span class="stat-plus text-gradient">+</span>
              </div>
              <p class="stat-label">YEARS EXPERIENCE</p>
            </div>
          </div>

          <div class="stat-glass-card magnetic" style="transition-delay: 0.3s">
            <div class="magnetic-inner">
              <div class="stat-number-wrapper">
                <span class="stat-number text-gradient" data-count="15">0</span><span class="stat-plus text-gradient">+</span>
              </div>
              <p class="stat-label">AWARDS WON</p>
            </div>
          </div>

        </div>
      </div>
    </section>'''

content = content.replace(stats_old, stats_new)

# 4. Replace Horizontal scroll cards to the new design
horizontal_old = '''          <!-- Project 1: Aura Fashion Editorial -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner">
                <div class="work-img" style="aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg); margin-bottom: 24px;">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJvJWI9aWuyZ3a1bVCNeuHyBWzS2TUezRse6Okc3B21eUKPjCUPENRwA6yHxIIDTa6l0g0ut8uJYfL2LP8denZ1fdikM5wG3WwIOF0TJcmZJhDBFybDgF31Fjj5HxLZjqD018N7HGO-ERwtUr6TSNUedJwi4j3KXlV75O91aiK9TGjp5qvobldMe6HeuRwz865hrgvHKcLXSQp85zB0gqAOg4QcJxWeUVLY7aBDw6MTk2i4QAbqW1ZASwccryyTsZ_qQZzzzeuowm7" alt="Abstract digital liquid forms" style="width: 100%; height: 100%; object-fit: cover;"/>
                </div>
                <div class="work-tags" style="margin-bottom: 16px;">
                  <span class="tag-acid">E-Commerce</span>
                  <span class="tag-glass">Branding</span>
                </div>
                <h3 class="headline-md" style="transition: color 0.3s ease;">Aura Fashion Editorial</h3>
              </div>
            </div>
          </div>

          <!-- Project 2: Nexus Platform (Web Dev) -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner">
                <div class="work-img" style="aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg); margin-bottom: 24px;">
                  <img src="assets/web_dev_project_1779235767420.png" alt="SaaS Web Application Dashboard" style="width: 100%; height: 100%; object-fit: cover;"/>
                </div>
                <div class="work-tags" style="margin-bottom: 16px;">
                  <span class="tag-acid">Web Development</span>
                  <span class="tag-glass">UI/UX</span>
                </div>
                <h3 class="headline-md" style="transition: color 0.3s ease;">Nexus Dashboard</h3>
              </div>
            </div>
          </div>

          <!-- Project 3: Vivid Identity (Graphic Design) -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner">
                <div class="work-img" style="aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg); margin-bottom: 24px;">
                  <img src="assets/graphic_design_project_1779235785632.png" alt="Bold Graphic Design Identity" style="width: 100%; height: 100%; object-fit: cover;"/>
                </div>
                <div class="work-tags" style="margin-bottom: 16px;">
                  <span class="tag-acid">Graphic Design</span>
                  <span class="tag-glass">Identity</span>
                </div>
                <h3 class="headline-md" style="transition: color 0.3s ease;">Vivid Brand Identity</h3>
              </div>
            </div>
          </div>

          <!-- Project 4: FitTrack (App Dev) -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner">
                <div class="work-img" style="aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg); margin-bottom: 24px;">
                  <img src="assets/app_dev_project_1779235802659.png" alt="Sleek Mobile App UI" style="width: 100%; height: 100%; object-fit: cover;"/>
                </div>
                <div class="work-tags" style="margin-bottom: 16px;">
                  <span class="tag-acid">App Development</span>
                  <span class="tag-glass">Mobile</span>
                </div>
                <h3 class="headline-md" style="transition: color 0.3s ease;">FitTrack App</h3>
              </div>
            </div>
          </div>'''

horizontal_new = '''          <!-- Project 1: E-Commerce -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 70vh; max-height: 700px; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner" style="position: relative; height: 100%; width: 100%; border-radius: var(--radius-xl); overflow: hidden;">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJvJWI9aWuyZ3a1bVCNeuHyBWzS2TUezRse6Okc3B21eUKPjCUPENRwA6yHxIIDTa6l0g0ut8uJYfL2LP8denZ1fdikM5wG3WwIOF0TJcmZJhDBFybDgF31Fjj5HxLZjqD018N7HGO-ERwtUr6TSNUedJwi4j3KXlV75O91aiK9TGjp5qvobldMe6HeuRwz865hrgvHKcLXSQp85zB0gqAOg4QcJxWeUVLY7aBDw6MTk2i4QAbqW1ZASwccryyTsZ_qQZzzzeuowm7" alt="E-Commerce Project" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"/>
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%); z-index: 1; pointer-events: none;"></div>
                
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 48px; z-index: 2; display: flex; flex-direction: column; gap: 12px; pointer-events: none;">
                  <div class="work-tags">
                    <span class="tag-acid">Case Study</span>
                  </div>
                  <h3 class="display-sm" style="color: #ffffff; margin: 0; text-shadow: 0 4px 24px rgba(0,0,0,0.5);">E-Commerce</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Project 2: Web Development -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 70vh; max-height: 700px; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner" style="position: relative; height: 100%; width: 100%; border-radius: var(--radius-xl); overflow: hidden;">
                <img src="assets/web_dev_project_1779235767420.png" alt="Web Development Project" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"/>
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%); z-index: 1; pointer-events: none;"></div>
                
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 48px; z-index: 2; display: flex; flex-direction: column; gap: 12px; pointer-events: none;">
                  <div class="work-tags">
                    <span class="tag-acid">Case Study</span>
                  </div>
                  <h3 class="display-sm" style="color: #ffffff; margin: 0; text-shadow: 0 4px 24px rgba(0,0,0,0.5);">Web Development</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Project 3: Graphic Design -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 70vh; max-height: 700px; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner" style="position: relative; height: 100%; width: 100%; border-radius: var(--radius-xl); overflow: hidden;">
                <img src="assets/graphic_design_project_1779235785632.png" alt="Graphic Design Project" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"/>
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%); z-index: 1; pointer-events: none;"></div>
                
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 48px; z-index: 2; display: flex; flex-direction: column; gap: 12px; pointer-events: none;">
                  <div class="work-tags">
                    <span class="tag-acid">Case Study</span>
                  </div>
                  <h3 class="display-sm" style="color: #ffffff; margin: 0; text-shadow: 0 4px 24px rgba(0,0,0,0.5);">Graphic Design</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Project 4: App Development -->
          <div class="horizontal-scroll-card">
            <div class="work-card tilt-card" style="height: 70vh; max-height: 700px; display: flex; flex-direction: column; justify-content: center;">
              <div class="tilt-card-inner" style="position: relative; height: 100%; width: 100%; border-radius: var(--radius-xl); overflow: hidden;">
                <img src="assets/app_dev_project_1779235802659.png" alt="App Development Project" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"/>
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%); z-index: 1; pointer-events: none;"></div>
                
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 48px; z-index: 2; display: flex; flex-direction: column; gap: 12px; pointer-events: none;">
                  <div class="work-tags">
                    <span class="tag-acid">Case Study</span>
                  </div>
                  <h3 class="display-sm" style="color: #ffffff; margin: 0; text-shadow: 0 4px 24px rgba(0,0,0,0.5);">App Development</h3>
                </div>
              </div>
            </div>
          </div>'''

content = content.replace(horizontal_old, horizontal_new)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
