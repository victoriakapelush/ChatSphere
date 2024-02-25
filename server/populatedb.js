console.log('This script populates posts to the database.');
const userArgs = process.argv.slice(2);
const Post = require("./models/Post");
const posts = [];
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = userArgs[0];
main().catch((err) => console.log(err));

async function main() {
   console.log("Debug: About to connect");
   await mongoose.connect(mongoDB);
   console.log("Debug: Should be connected?");
   await createPosts();
   console.log("Debug: Closing mongoose");
   mongoose.connection.close();
}

async function postCreate(index, title, description, image, text, tag) {
   const post = new Post({ title: title, description: description, image: image, text: text, tag: tag });
   await post.save();
   posts[index] = post;
   console.log(`Added post: ${title}`);
}

async function createPosts() {
   console.log("Adding posts");
   const imagePathPrefix = "./images/";
   await Promise.all([
      postCreate(
        0, 
        "The history of web design", 
        "Navigating the realm of web design entails more than creative flair, involving constant adaptation, collaboration, and an understanding of both aesthetic and functional aspects to truly excel in the field.",
        `${imagePathPrefix}web-designer.jpg`,
        "The history of web design is a fascinating journey that traces the evolution of the digital landscape from its inception to the complex and dynamic field it is today. In the early 1990s, the World Wide Web emerged, and the first websites were basic, text-heavy pages with minimal graphics. The advent of HTML in 1995 allowed for more structured and visually appealing layouts. As the internet gained popularity, the late 1990s witnessed the rise of Flash, enabling more interactive and multimedia-rich websites. The early 2000s brought about the era of CSS, separating content from presentation and providing greater design flexibility. The mid-2000s saw the emergence of responsive design to accommodate the diverse array of devices accessing the internet. With the 2010s came the dominance of mobile-first design, focusing on optimal experiences for smartphones and tablets. Today, web design continues to evolve with trends like minimalism, user-centric design, and the integration of emerging technologies, reflecting an ongoing narrative of innovation and adaptability in the ever-changing digital landscape.",
        "Culture"
       ),
    ]);
}
  