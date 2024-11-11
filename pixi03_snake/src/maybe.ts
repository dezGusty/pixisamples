export interface Maybe<T> {
  data?: T;
  hasData(): boolean;
};


function Maybe_Some<T>(data: T): Maybe<T> {
  return { data: data, hasData: () => true };
}

function Maybe_None<T>(): Maybe<T> {
  return { hasData: () => false };
}

export namespace Maybe {

  export function Some<T>(data: T): Maybe<T> {
    return Maybe_Some(data);
  }

  export function None<T>(): Maybe<T> {
    return Maybe_None();
  }
}