"use strict"

module.exports = (createdAt, updatedAt) => {
    const createdAtTime = Math.abs(Date.now() - new Date(createdAt).getTime());
    const updatedAtTime = Math.abs(Date.now() - new Date(updatedAt).getTime());

    const createdAtSecond = createdAtTime / 1000;
    const updatedAtSecond = updatedAtTime / 1000;

    let createdAtAgo
    let updatedAtAgo

    if (createdAtSecond < 60) createdAtAgo = `${createdAtSecond} seconds ago`;
    else if (createdAtSecond > 59 && createdAtSecond < 3600) createdAtAgo = `${Math.floor(createdAtSecond / 60)} minutes ago`
    else if (createdAtSecond > 3599 && createdAtSecond < 86400) createdAtAgo = `${Math.floor(createdAtSecond / 3600)} hours ago`
    else if (createdAtSecond > 86400 && createdAtSecond < 2592000) createdAtAgo = `${Math.floor(createdAtSecond / 86400)} days ago`
    else if (createdAtSecond > 2592000 && createdAtSecond < 31104000) createdAtAgo = `${Math.floor(createdAtSecond / 2592000)} months ago`
    else createdAtAgo = `${Math.floor(createdAtSecond / 31104000)} years ago`

    if (updatedAtSecond < 60) createdAtAgo = `${updatedAtSecond} seconds ago`;
    else if (updatedAtSecond > 59 && updatedAtSecond < 3600) updatedAtAgo = `${Math.floor(updatedAtSecond / 60)} minutes ago`
    else if (updatedAtSecond > 3599 && updatedAtSecond < 86400) updatedAtAgo = `${Math.floor(updatedAtSecond / 3600)} hours ago`
    else if (updatedAtSecond > 86400 && updatedAtSecond < 2592000) updatedAtAgo = `${Math.floor(updatedAtSecond / 86400)} days ago`
    else if (updatedAtSecond > 2592000 && updatedAtSecond < 31104000) updatedAtAgo = `${Math.floor(updatedAtSecond / 2592000)} months ago`
    else updatedAtAgo = `${Math.floor(updatedAtSecond / 31104000)} years ago`

    return { createdAt : createdAtAgo, updatedAt: updatedAtAgo }
}