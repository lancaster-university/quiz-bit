# Quiz:bit

micro:bit programs and a matching application for providing a quiz-voter-style service using micro:bits as the controls.

# Downloads

Download the chrome application now from the [Google Chrome store](https://chrome.google.com/webstore/detail/quizbit/hfnanbphehfnlcpkelfnkmfdljphlmna?hl=en-US).

Download the micro:bit hex files `QuizMaster.hex` and `Quizzer.hex` as a zip file from our [microbit-docs](https://lancaster-university.github.io/microbit-docs/resources/quiz-bit.zip) page. Alternately, clone this git repository, and navigate to `prebuilt`.

## How it Works

Quiz:bit utilises the micro:bit's radio and serial port connectivity to provide an *almost* wireless voting system.

  1. Flash any number of micro:bits with the Quizzer hex file - these will be for your voters.
  2. Flash one micro:bit with your Quizmaster hex file. This will act as a bridge between the desktop application and the other micro:bits.
  3. Launch any variant of the Quiz:bit application and wait it for it to detect your connected Quizmaster micro:bit.
  4. Edit your questions & answers.
  5. Click 'Start Vote'!

  Once a question is received the Quizzer micro:bits will display a letter. Use the A and B buttons to cycle through the letter options and press them both simultaneously to lock in your answer.

### Note: Windows Driver

MACOSX and Linux systems will be able to communicate with the Quizmaster micro:bit out of the box. Users with Windows systems (below Windows 10) will need to install the [serial driver](https://developer.mbed.org/handbook/Windows-serial-configuration) before the Quiz:bit app will be able to detect their micro:bit. Follow the instructions on this download page carefully. Your micro:bit (mbed) **must be plugged in during installation**.

## Building

For the C++ micro:bit programs, simply use the hex files provided under prebuilt, or take a look at setting up an offline-toolchain for the micro:bit with [yotta](http://lancaster-university.github.io/microbit-docs/offline-toolchains/#yotta).

For the web-apps you will need the latest version of NodeJS, npm and Grunt.
Navigate to the web-app directory and type **npm install** to download the dependencies. Type **grunt** to build the source and **grunt build-with-windows**, **grunt build-with-mac** or **grunt build-with-nwjs** to build it with either (or both) nwjs applications. The resulting web-app/build folder will include all the files needed for a Chrome App. nwjs apps for Windows and MAC OSX will be found under web-app/nwjsBuilds.

## Links

[NodeJS](https://nodejs.org/en/download/) | [Grunt](http://gruntjs.com) | [Chrome Apps](https://developer.chrome.com/apps/app_codelab_basics#developer-mode) | [micro:bit](http://microbit.co.uk/)

## License & Copyright

"BBC" and "micro:bit" are trade marks of the BBC.

[BBC Community Guidelines](https://www.microbit.co.uk/help#sect_cg)

Quiz:bit code is licensed under the MIT License (MIT).

Copyright (c) 2016 Lancaster University, UK.
