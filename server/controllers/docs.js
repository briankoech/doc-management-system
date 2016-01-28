(function() {
  'use strict';
  var Document = require('../models/document'),
    Role = require('../models/role'),
    Category = require('../models/category'),
    User = require('../models/user');


  module.exports = {
    create: function(req, res) {
      var docsave = function(categoryId) {
        var document = new Document({
          ownerId: req.decoded._id,
          accessLevel: req.body.accessLevel,
          title: req.body.title,
          category: categoryId,
          content: req.body.content,
          createdAt: new Date()
        });

        document.save(function(err, doc) {
          if (err) {
            res.status(500).send({
              error: err
            });
          } else {
            res.status(201).send({
              message: 'Document created successfuly',
              doc: doc
            });
          }
        });
      };
      // get userid from the token
      Role.findById(req.decoded.role, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (!role) {
          res.status(404).send({
            error: 'no such role found',
            role: req.decoded.role
          });
        } else {
          if (role.title === 'viewer') {
            res.status(403).send({
              error: 'You are not authorised to create document'
            });
          } else {
            // check if category exists
            Category.findOne({
              'category': req.body.category.toLowerCase()
            }, function(err, result) {
              if (err) {
                res.status(500).send({
                  error: 'Server error. Couldn\'t confirm category'
                });
              } else if (!result) {
                var category = new Category({
                  category: req.body.category.toLowerCase()
                });

                category.save(function(err, cat) {
                  if (err) {
                    res.status(500).send({
                      error: err,
                      err: 'another new one'
                    });
                  } else {
                    // go to doc saving
                    docsave(cat._id);
                  }
                });
              } else {
                // go to doc saving
                docsave(result._id);
              }
            });
          }
        }
      });
    },

    getAllDocuments: function(req, res) {
      Document.find({})
        .limit(10)
        .sort({
          'createdAt': -1
        })
        .exec(function(err, documents) {
          if (err) {
            res.status(500).send(err);
          } else if (!documents) {
            res.status(404).send({
              error: 'No documents found'
            });
          } else {
            res.status(200).send(documents);
          }
        });
    },

    getAllDocumentsByRole: function(req, res) {
      Role.findById(req.decoded.role, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (role) {
          if (role.title === 'admin') {
            findDocs(1);
          } else if (role.title === 'contributor') {
            findDocs(2);
          } else {
            findDocs(3);
          }
        } else {
          res.status(404).send({
            message: 'No such role'
          });
        }
      });

      var findDocs = function(level) {
        Document.find({
            accessLevel: {
              $gte: level
            }
          })
          .limit(10)
          .sort({
            'createdAt': -1
          })
          .exec(function(err, documents) {
            if (err) {
              res.status(500).send(err);
            } else if (documents.length === 0) {
              res.status(404).send({
                message: 'No documents found'
              });
            } else if (documents) {
              res.status(200).send(documents);
            }
          });
      };
    },

    getAllDocumentsByDate: function(req, res) {
      Document.find({
        'createdAt': {
          $gte: new Date(req.query.from),
          $lt: new Date(req.query.to) || new Date()
        }
      }, function(err, documents) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (documents.length < 1) {
          res.status(404).send({
            message: 'No doc found'
          });
        } else {
          res.status(200).send(documents);
        }
      });
    },

    getDocumenstByCategory: function(req, res) {
      // find the categoryId
      Category.find({
        category: req.query.category.toLowerCase()
      }, function(err, category) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          // get the categoryId
          Document.find({
            category: category[0]._id
          }, function(err, documents) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else {
              res.status(200).send(documents);
            }
          });
        }
      });
    },

    addContributors: function(req, res) {
      // Get the doc
      // check if you are the owner or admin
      // get the contributorsId check if it exists
      Document.findById(req.params._id, function(err, doc) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (!doc) {
          res.status(404).send({
            message: 'No such doc'
          });
        } else {
          // get the user role
          Role.findById(req.decoded.role, function(err, role) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else {
              // check the role
              if (doc.ownerId === req.decoded._id || role.title === 'admin') {
                // can add contributors to doc
                User.findById(req.body.contributor, function(err, user) {
                  if (err) {
                    res.status(500).send({
                      error: err
                    });
                  } else if (!user) {
                    res.status(404).send({
                      message: 'no such user'
                    });
                  } else {
                    Document.findByIdAndUpdate(doc._id, {
                      $push: {
                        'contributors': req.body.contributor
                      }
                    }, {
                      safe: true,
                      upsert: true
                    }, function(err, result) {
                      if (err) {
                        res.status(500).send({
                          error: err
                        });
                      } else {
                        res.status(200).send({
                          message: 'contributor added',
                          doc: result
                        });
                      }
                    });
                  }
                });
              } else {
                res.status(403).send({
                  message: 'you are not authorised'
                });
              }
            }
          });
        }
      });
    },

    findOne: function(req, res) {
      Document.findById(req.params._id, function(err, document) {
        if (err) {
          res.status(500).send(err);
        } else if (document) {
          res.status(200).send(document);
        } else {
          res.status(404).send({
            message: 'document isnt available'
          });
        }
      });
    },

    update: function(req, res) {
      // update if you are admin, owner or contributor
      Role.findById(req.decoded.role, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          Document.findById(req.params._id, function(err, doc) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else {
              if (role.title === 'admin' || req.decoded._id === doc.ownerId || doc.contributors.indexOf(req.decoded._id) >= 0) {
                req.document = doc;
                doc.title = req.body.title;
                doc.content = req.body.content;
                doc.save(function(err, result) {
                  (err) ? res.status(500).send({
                    error: err
                  }): res.status(200).send(result);
                });
              } else {
                res.status(403).send({
                  message: 'You are not allowed to edit this doc'
                });
              }
            }
          });
        }
      });
    },

    getAllById: function(req, res) {
      // get the user id
      Document.find({
        ownerId: req.decoded.id
      }, function(err, documents) {
        if (err) {
          return res.status(500).send(err);
        } else if (documents) {
          return res.status(200).send(documents);
        } else {
          return res.send({
            message: 'No documents found'
          });
        }
      });
    },

    delete: function(req, res) {
      // delete if you are the owner or admin
      Role.findById(req.decoded.role, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          Document.findById(req.params._id, function(err, doc) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else if (doc) {
              if (role.title === 'admin' || req.decoded._id === doc.ownerId) {
                Document.remove({
                  _id: req.params._id
                }, function(err) {
                  err ? res.status(500).send({
                    error: err
                  }) : res.status(200).send({
                    message: 'delete successfuly'
                  });
                });
              } else {
                res.status(403).send({
                  message: 'You are not allowed to delete this doc'
                });
              }
            } else {
              res.status(404).send({
                message: 'Document not found'
              });
            }
          });
        }
      });
    }

  };

})();
