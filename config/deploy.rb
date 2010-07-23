# deploy.rb
# sample capistrano deploy file
# USAGE:
#  => cap build deploy:setup
#  => cap build deploy
#  => cap staging restart
#  => Do notice after deploy callbacks 

task :production do
  role :web, "gakshay.com"
  role :app, "gakshay.com"
  role :db,  "gakshay.com", :primary => true
  set :application, "auto_date"
end

task :demo do
  role :web, "gakshay.com"
  role :app, "gakshay.com"
  role :db,  "gakshay.com", :primary => true
  set :application, "demo_auto_date"
end

set(:deploy_to) { "/home1/knowabou/public_html/rails_apps/#{application}" }
set :keep_releases, 5
set :use_sudo, false

set :user, "knowabou"
# set :password, "<ssh-user-password>"
# set :group, "<user-group>"

set :repository, "git@github.com:gakshay/auto-date.git"
set :scm, "git"
#set :branch, "<which-branch-needs-to-be-deployed>"
#set :scm_username, "<scm-username>"
#set :scm_password, "<scm-passsword>"

after "deploy", "deploy:cleanup"
after "deploy:migrations", "deploy:cleanup"
after "deploy:update_code", "deploy:symlink_configs"#, "deploy:symlink_custom"

namespace :deploy do

  desc "Restart Application"
  task :restart, :roles => :app do
    run "touch #{deploy_to}/#{shared_dir}/tmp/restart.txt"
  end

  desc "Setup Standard Configuration Links"
  task :symlink_configs, :roles => [:app] do
    # relink shared database configuration
    run "ln -nfs #{deploy_to}/#{shared_dir}/config/database.yml #{release_path}/config/database.yml"

    # relink shared tmp dir
    run "rm -rf #{release_path}/tmp"  # technically shouldn't be in svn/git
    run "ln -nfs #{deploy_to}/#{shared_dir}/tmp #{release_path}/tmp"
  end

  desc "Custom Symlinks"
  task :symlink_custom, :roles => [:app] do
    run "if [ -d #{release_path}/public/gallery_photos ]; then mv #{release_path}/public/gallery_photos #{release_path}/public/gallery_photos.bak; fi; ln -nfs #{shared_path}/directories/gallery_photos #{release_path}/public/gallery_photos"
    run "if [ -d #{release_path}/public/profile_photos ]; then mv #{release_path}/public/profile_photos #{release_path}/public/profile_photos.bak; fi; ln -nfs #{shared_path}/directories/profile_photos #{release_path}/public/profile_photos"
  end

end

namespace :files do
  desc "list all the files"
  task :list, :roles => :app do 
    run "cd #{deploy_to}; ls -l"
  end
  
  desc "tree structure of the files"
  task :tree, :roles => :app do 
    run "cd #{deploy_to}; tree"
  end
end