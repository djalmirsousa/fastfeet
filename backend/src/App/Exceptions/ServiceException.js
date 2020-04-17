export default function(message, status = 400) {
  this.name = 'ServiceException';
  this.status = status;
  this.error = new Error(message);
  this.message = this.error.message;
}
