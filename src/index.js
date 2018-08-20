document.addEventListener('DOMContentLoaded', function() {

  renderImage()

// FETCH IMAGE
  async function fetchImage() {
    const imageId = 13
    const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
    try {
      const response = await fetch(imageURL)
      const data = await response.json()
      return data
    } catch (err) {
      console.log(err)
    }
  }

// LIKE IMAGE
  async function likeImage(like) {
    const likeURL = `https://cors-anywhere.herokuapp.com/https://randopic.herokuapp.com/likes/`
    try {
      const response = await fetch(likeURL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(like)
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }

// CREATE COMMENT
  async function postComment(post) {
    const commentsURL = `https://randopic.herokuapp.com/comments/`
    try {
      const response = await fetch(commentsURL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }

  // DELETE COMMENT
  async function deleteComment(id) {
    const deleteURL = `https://randopic.herokuapp.com/comments/${id}`
    const response = await fetch(deleteURL, {
      method: "DELETE"
    })
    renderImage()
    return response.json()
  }

// RENDER IMAGE TO PAGE
  function renderImage() {
    fetchImage().then(image => {
      // const imageContentDiv = document.getElementById("image_content")
      const imageDiv = document.getElementById("image_card")

      // image
      const img = document.getElementById("image")
      img.src = image.url

      // name
      const name = document.getElementById("name")
      name.innerText = image.name

      // likes
      const likes = document.getElementById("likes")
      likes.innerText = image.like_count

      // likes button
      const likeButton = document.getElementById("like_button")
      // event listener for liking the image
      likeButton.addEventListener("click", () => {
        let newLikes = ++likes.innerText
        const like = {
          image_id: image.id,
          like_count: newLikes
        }

        // update likes of image
        likeImage(like)
      })

      // comments
      const commentsList = document.getElementById("comments")
      commentsList.innerHTML = ""
      image.comments.forEach(comment => {
        const li = document.createElement("li")
        li.innerText = comment.content

        // delete button
        const deleteButton = document.createElement("button")
        deleteButton.innerText = "Delete comment"
        deleteButton.classList.add("btn")
        deleteButton.classList.add("btn-danger")
        commentsList.append(li, deleteButton)

        // delete functionality
        deleteButton.addEventListener("click", () => {
          deleteComment(comment.id)
        })
      })

      // comment form
      const commentForm = document.getElementById("comment_form")
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const comment = document.getElementById("comment_input")
        const newComment = comment.value

        // fetch image again to grab all existing comments
        fetchImage().then(image => {
          const li = document.createElement("li")
          li.innerText = newComment
          const deleteButton = document.createElement("button")
          deleteButton.classList.add("btn")
          deleteButton.classList.add("btn-danger")
          deleteButton.innerText = "Delete comment"
          commentsList.append(li, deleteButton)
          deleteButton.addEventListener("click", () => {
            deleteComment(comment.id)
          })
          const commentObj = {
            image_id: image.id,
            content: newComment
          }

          // post request for new comment
          postComment(commentObj)

          commentsList.append(li, deleteButton)
          comment.value = ""
        })
      })
      // imageDiv.append(img, name, likes)
    })
  }

})
