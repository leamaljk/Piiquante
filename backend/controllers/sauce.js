const Sauce = require('../models/sauce');
const fs = require('fs'); // file system - gives access to functions that allow you to modify the file system

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces); //ok
    }
  ).catch(
    (error) => {
      res.status(400).json({ //bad request
        error: error
      });
    }
 );
};


//creates new sauce from model and user data, sets initial likes/dislikes to zero and usersLiked/usersDisliked to empty arrays
exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host'); //reconstructing the full url of a saved file
      const sauce = new Sauce({
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
      /*then using the sauce model we will create a new instance of our sauce model
      ;passing in it JS object, containing all the information it needs
      from the parsed request body */
  });
  sauce.save()
      .then(
          () => {
              res.status(201) //created
                  .json({
                      message: 'Sauce saved successfully!'
                  });
          }
      )
      .catch(
          (error) => {
              res.status(400) //bad request
                  .json({
                      error: error
                  });
          }
      );
};



exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => res.status(200).json(sauce)) //ok
  .catch((error) => res.status(404).json({error: error})) //not found on server
}




//makes changes to the database entry for selected sauce id, checks if image change is required
exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({
      _id: req.params._id
  });
  if (req.file) { //form data and a file
      const url = req.protocol + '://' + req.get('host');
      req.body.sauce = JSON.parse(req.body.sauce);
      sauce = { 
          _id: req.params.id,
          userId: req.body.sauce.userId,
          name: req.body.sauce.name,
          manufacturer: req.body.sauce.manufacturer,
          description: req.body.sauce.description,
          mainPepper: req.body.sauce.mainPepper,
          imageUrl: url + '/images/' + req.file.filename,
          heat: req.body.sauce.heat,
      };
  } else { //json data
      sauce = {
          _id: req.params.id,
          userId: req.body.userId,
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          mainPepper: req.body.mainPepper,
          imageUrl: req.body.imageUrl,
          heat: req.body.heat,
      };
  };
  //updates sauce with selected id with newly created sauce object 
  Sauce.updateOne({
          _id: req.params.id
      }, sauce)
      .then(
          () => {
              res.status(201) //created / updated
                  .json({
                      message: 'Sauce was successfully modified'
                  });
          }
      )
      .catch(
          (error) => {
              res.status(400) //bad request
                  .json({
                      error: error
                  });
          }
      );
};


//deletes sauce object from database for selected id; deletes corresponding image file
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
          _id: req.params.id
      })
      .then(
          (sauce) => {
              const filename = sauce.imageUrl.split('/images')[1];
              fs.unlink('images/' + filename, () => {
                  Sauce.deleteOne({
                          _id: req.params.id
                      })
                      .then(
                          () => {
                              res.status(200) //ok
                                  .json({
                                      message: 'Sauce successfully deleted'
                                  });
                          }
                      )
                      .catch(
                          () => {
                              res.status(400) //bad request
                                  .json({
                                      error: error
                                  });
                          }
                      );
              });
          }
      );
};



  //updates likes, dislikes from selected sauce id
exports.likeSauce = (req, res, next) => {
  // finds sauce of selected id
  let sauce = Sauce.findOne({
          _id: req.params.id
      })
      .then(
          (sauce) => {
              // if liked, adds userId to usersLiked array
              if (req.body.like === 1) {
                  sauce.usersLiked.push(req.body.userId)
              };
              // if disliked, adds userId to usersDisliked array
              if (req.body.like === -1) {
                  sauce.usersDisliked.push(req.body.userId)
              };
              // if unliked or unDisliked removes userId form corresponding array
              if (req.body.like === 0) {
                  if (sauce.usersLiked.includes(req.body.userId)) {
                      sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId))
                  } else {
                      sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId))
                  };
              };
              // create new object data for sauce of selected id
              sauce = {
                  _id: req.params.id,
                  likes: sauce.usersLiked.length,
                  dislikes: sauce.usersDisliked.length,
                  usersLiked: sauce.usersLiked,
                  usersDisliked: sauce.usersDisliked
              };
              // updates the database with the new data
              Sauce.updateOne({_id: req.params.id }, sauce)
                  .then(
                      () => {
                          res.status(201).json({ //created
                                  message: 'Sauce was successfully liked' });
                      }
                  )
                  .catch(
                      (error) => {
                          res.status(400) //bad request
                              .json({
                                  error: error
                              });
                      }
                  );
          }
      )
}



