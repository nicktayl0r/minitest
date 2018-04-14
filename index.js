module.exports = function runner() {
	let _t = [], _s, _f

	function o(s, ...v) {
		if (typeof s == 'string' && v.length == 1 && typeof v[0] == 'function') {
			if (_s) throw new Error('Nested o()')
			else _t.push([s||'?', v[0]])
		} else if (!_s) throw new Error('Orphan assert')

		return b => { _f(b ? null : (new Error()).stack, _s, String.raw(s, ...v)) }
	}

	o.run = f => {
		if (typeof f != 'function') throw new Error('No callback')

		_f = f;

		return _t.reduce((p, [s, f]) => p.then(() => (_s = s, f())).catch(e => _f(e.stack, _s, e.message)),
			Promise.resolve()).then(() => { _s = false, _t = [] })
	}

	return o
}
