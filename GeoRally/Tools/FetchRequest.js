

class FetchRequest
{
    constructor(url, method = "GET", body = '', options = {})
    {
        this.url = url;
        this.method = method;
        this.body = body;
        this.options = options;
        this.hasCanceled_ = false;
    }

    open()
    {
        fetchOptions = {
            method: this.method,
            credentials: "include",
            headers:
            {
                'Accept': 'text/html',
                'Content-Type': FetchRequest.isJsonString(this.body) ? 'application/json' : 'application/x-www-form-urlencoded',
            },
            ...this.options
        }
        if ( (this.method === 'POST' || this.method === 'PUT' ) && this.body) fetchOptions.body = this.body;

        let promise = fetch(this.url, fetchOptions)

        const wrappedPromise = new Promise((resolve, reject) =>
        {
            promise.then(
                val => this.hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
                error => this.hasCanceled_ ? reject({isCanceled: true}) : reject(error)
            );
        });
        return wrappedPromise
    }

    abort()
    {
        this.hasCanceled_ = true;
    }


    static isJsonString(str)
    {
        try
        {
            JSON.parse(str);
        }
        catch (e)
        {
            return false;
        }
        return true;
    }
}

export default FetchRequest