module.exports = function extendsBufferToStringEncodings(iconv) {
    Buffer.prototype._$_toString = Buffer.prototype.toString;
    Buffer.prototype.toString = function(encoding, start, end) {
        if (Buffer.isEncoding(encoding)) {
            return this._$_toString.apply(this, arguments);
        }

        start = start || 0;
        end = end || this.length;
        var buf = this.slice(start, end);

        if (iconv.encodingExists(encoding)) {
            return iconv.decode(buf, encoding);
        }
        throw new TypeError('Unknown encoding: ' + encoding);
    };
};