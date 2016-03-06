module.exports = function(grunt) {

  grunt.initConfig({

    shell: {
      mongo: {
        command: "mongod",
        options: {
            async: true,
            stdout: false,
            stderr: true,
            failOnError: true
        }
      }
    },

    jshint: {
      all: ['client/js/**/*.js']
    },

    watch: {
      css: {
        files: ['client/css/*.css']
      },
      js: {
        files: ['client/js/**/*.js', 'server/**/*.js', ''],
        tasks: ['jshint']
      }
    },

    // configure nodemon
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    }   

  });

  // load nodemon
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell-spawn')

  // register the nodemon task when we run grunt
  grunt.registerTask('default', ['shell:mongo', 'nodemon']);  

};