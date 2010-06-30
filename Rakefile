# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'boot'))

require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'tasks/rails'

begin
  require 'jeweler'
  Jeweler::Tasks.new do |gemspec|
    gemspec.name = "auto-date"
    gemspec.version = File.read("VERSION").strip
    gemspec.summary = "JS based autocomplete date selector"
    gemspec.description = "Supports any known date formats (DD-MM-YY/MM-DD-YY/Mon-DD-YY/DD-Mon-YY, any seperator('/ - space .'), type literals to explore more). Highly customizable to give a look and feel of your website. Supports ONLY_FUTURE_DATE feature. Please go through the README to understand and how to use it."
    gemspec.email = "akshaygupta.dev@gmail.com"
    gemspec.homepage = "http://github.com/gakshay/auto-date"
    gemspec.authors = ["Akshay Gupta (gakshay)"]
  end
rescue LoadError
  puts "Jeweler not available. Install it with: gem install jeweler"
end

desc "Set the current gem version in the code according to the VERSION file"
task :set_version do
  VERSION=File.read("VERSION").strip
  ["public/javascripts/auto_date/auto_date.js"].each do |file|
    abs_file = File.dirname(__FILE__) + "/" + file
    src = File.read(abs_file)
    src = src.map do |line|
      case line
      when /^ *VERSION/                        then "  VERSION = '#{VERSION}'\n"
      when /^\/\/ AutoDate version / then "// AutoDate version #{VERSION} - a prototype based autocomplete date selector\n"
      else
        line
      end
    end.join
    File.open(abs_file, "wb") { |f| f << src }
  end
end

desc 'Generate documentation for the auto date gem.'
Rake::RDocTask.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'Autodate'
  rdoc.options << '--line-numbers --inline-source'
  rdoc.rdoc_files.include('README')
  rdoc.rdoc_files.include('lib/**/*.rb')
end
